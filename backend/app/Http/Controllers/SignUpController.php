<?php

namespace App\Http\Controllers;

use App\CarParkPayment;
use App\SignUpRecord;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Input;

class SignUpController extends BaseController
{
    public function index()
    {
        $record = new SignUpRecord();
        $record->name = Input::get('name');
        $record->mobile = Input::get('mobile');
        $record->email = Input::get('email');
        $record->comments = Input::get('comments');
        $record->extra = file_get_contents("php://input");
        $record->save();
        return ['ok' => true];
    }
}
