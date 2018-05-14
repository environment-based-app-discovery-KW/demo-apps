<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * App\ExamStudent
 *
 * @property int $id
 * @property string $public_key
 * @property string $name
 * @property string $student_no
 * @property \Carbon\Carbon|null $created_at
 * @property \Carbon\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|\App\ExamStudent whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\ExamStudent whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\ExamStudent whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\ExamStudent wherePublicKey($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\ExamStudent whereStudentNo($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\ExamStudent whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class ExamStudent extends Model
{
    //
}
