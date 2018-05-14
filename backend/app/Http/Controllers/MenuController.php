<?php

namespace App\Http\Controllers;

use App\CarParkPayment;
use App\ExamPaper;
use App\ExamStudent;
use App\ExamSubmission;
use App\Menu;
use App\MenuOrder;
use App\SignUpRecord;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Input;
use Illuminate\Validation\Rules\In;

class MenuController extends BaseController
{

    public function get()
    {
        $id = Input::get('id', 0);
        $menu = Menu::find($id);
        if (!$menu) {
            return error("Invalid id");
        }
        return $menu;
    }

    public function order()
    {

        $signature = Input::get("signature");
        $signedContentInString = Input::get("signedContent");
        $publicKey = Input::get("publicKey");
        if (!verfiySignature($signature, $signedContentInString, $publicKey)) {
            return error("Invalid signature");
        }

        $signedContent = json_decode($signedContentInString);

        //TODO: validate price of the order
        $order = new MenuOrder();
        $order->user_public_key = $publicKey;
        $order->amount_paid = $signedContent->amount_to_pay;
        $order->content = json_encode(Input::get("orders"));
        $order->save();

        // forward payment request to central server
        $ch = curl_init(env('CENTRAL_SERVER_URL') . "/payment/submit");
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
        curl_setopt($ch, CURLOPT_POSTFIELDS, file_get_contents("php://input"));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
        curl_setopt($ch, CURLOPT_PROXY, "");

        $result = curl_exec($ch);
        $result_parsed = json_decode($result);
        if ($result_parsed->ok) {
            return ["ok" => true];
        } else {
            return error($result);
        }
    }
}
