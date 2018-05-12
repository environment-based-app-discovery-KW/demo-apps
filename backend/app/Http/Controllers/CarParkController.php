<?php

namespace App\Http\Controllers;

use App\CarParkPayment;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Input;

class CarParkController extends BaseController
{

    public function order()
    {
        $payment = new CarParkPayment();
        $payment->paid = 0;
        $payment->license_plate_number = Input::get('license_plate_number');
        $payment->parking_minutes = Input::get('parking_minutes');
        $payment->user_public_key = "";
        $payment->amount_paid = 0;
        $payment->save();
        return ['id' => $payment->id];
    }

    public function pay()
    {
        $signature = Input::get("signature");
        $signedContentInString = Input::get("signedContent");
        $publicKey = Input::get("publicKey");
        if (!verfiySignature($signature, $signedContentInString, $publicKey)) {
            return error("Invalid signature");
        }

        $signedContent = json_decode($signedContentInString);
        $id = $signedContent->order_id;
        $payment = CarParkPayment::find($id);
        if (!$payment || $payment->paid) {
            return error("Invalid ID");
        }
        $payment->user_public_key = $publicKey;
        $payment->amount_paid = $signedContent->amount_to_pay;
        $payment->paid = 1;
        $payment->save();
        return ["ok" => true];
    }
}
