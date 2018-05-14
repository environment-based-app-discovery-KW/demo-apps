<?php

namespace App\Http\Controllers;

use App\CarParkPayment;
use App\ExamPaper;
use App\ExamStudent;
use App\ExamSubmission;
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
            return ['name' => $paper->name, 'content' => $content, 'allowed_time_seconds' => $paper->allowed_time_seconds];
        }
    }

    public function submit()
    {
        $public_key = getUserPublicKey("exam");
        if (!is_string($public_key)) {
            return $public_key;
        }
        $student = ExamStudent::wherePublicKey($public_key)->first();
        if (!$student) {
            return error("no info");
        }
        $paper = ExamPaper::whereIsEnabled(1)->first();
        if (!$paper) {
            return ['waiting' => true];
        } else {
            // 自动批改
            $answers = Input::get('answers', []);
            $score = 0;
            $content = json_decode($paper->content_json);
            for ($i = 0; $i < count($content); $i++) {
                if ($content[$i]->key == @$answers[$i]) {
                    $score++;
                };
            }
            $examSubmission = new ExamSubmission();
            $examSubmission->exam_paper_id = $paper->id;
            $examSubmission->exam_student_id = $student->id;
            $examSubmission->solutions = json_encode($answers);
            $examSubmission->score = $score;
            $examSubmission->save();
            return ["score" => $score, "fullScore" => count($content)];
        }
    }
}
