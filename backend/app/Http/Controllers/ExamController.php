<?php

namespace App\Http\Controllers;

use App\CarParkPayment;
use App\ExamPaper;
use App\ExamStudent;
use App\SignUpRecord;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Input;
use Illuminate\Validation\Rules\In;

class ExamController extends BaseController
{
    public function getUserInfo()
    {
        $public_key = getUserPublicKey("exam");
        if (!is_string($public_key)) {
            return $public_key;
        }
        $student = ExamStudent::wherePublicKey($public_key)->first();
        if (!$student) {
            return error("no info");
        }
        return $student;
    }

    public function setUserInfo()
    {
        $public_key = getUserPublicKey("exam");
        if (!is_string($public_key)) {
            return $public_key;
        }
        if (ExamStudent::wherePublicKey($public_key)->exists()) {
            return error("cannot set info again");
        }
        $student = new ExamStudent();
        $student->public_key = $public_key;
        $student->name = Input::get('name');
        $student->student_no = Input::get('student_no');
        $student->save();
        return $student;
    }

    public function getPaper()
    {
        $paper = ExamPaper::whereIsEnabled(1)->first();
        if (!$paper) {
            return ['waiting' => true];
        } else {
            $content = json_decode($paper->content_json);
            foreach ($content as $item) {
                unset($item->key);
            }
            return $content;
        }
    }
}
