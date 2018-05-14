<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * App\ExamPaper
 *
 * @property int $id
 * @property string $name
 * @property string $content_json
 * @property int $allowed_time_seconds
 * @property int $is_enabled
 * @property \Carbon\Carbon|null $created_at
 * @property \Carbon\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|\App\ExamPaper whereAllowedTimeSeconds($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\ExamPaper whereContentJson($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\ExamPaper whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\ExamPaper whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\ExamPaper whereIsEnabled($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\ExamPaper whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\ExamPaper whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class ExamPaper extends Model
{
    //
}
