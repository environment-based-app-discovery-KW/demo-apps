<?php

namespace App\Http\Controllers;

use Faker\Generator as Faker;
use App\CarParkPayment;
use App\SignUpRecord;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Input;

class ScheduleController extends BaseController
{
    public function index(Faker $faker)
    {
        $rooms = [];
        for ($i = 0; $i < 4; $i++) {
            $rooms[$faker->buildingNumber] = $this->generateSchedule($faker);
        }
        return $rooms;
    }

    /**
     * @param Faker $faker
     * @return array
     */
    private function generateSchedule(Faker $faker): array
    {
        $schedules = [];
        for ($i = 0; $i < 30;) {
            $i += rand(1, 4);
            if (count($schedules) > 0) {
                $schedules[count($schedules) - 1]['end'] = $i;
            }
            $schedules[] = ["start" => $i, "title" => $faker->sentence, "description" => $faker->paragraph, "speaker" => $faker->name];
        }
        return $schedules;
    }
}
