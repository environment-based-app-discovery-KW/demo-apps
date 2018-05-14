<?php

namespace App\Http\Controllers;

use App\CarParkPayment;
use App\ExamPaper;
use App\ExamStudent;
use App\ExamSubmission;
use App\Menu;
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

    public function submit()
    {
    }
}
