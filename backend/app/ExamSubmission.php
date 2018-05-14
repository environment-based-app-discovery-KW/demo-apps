<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * App\ExamSubmission
 *
 * @property int $id
 * @property int $exam_paper_id
 * @property int $exam_student_id
 * @property string $solutions
 * @property int $score
 * @property \Carbon\Carbon|null $created_at
 * @property \Carbon\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|\App\ExamSubmission whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\ExamSubmission whereExamPaperId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\ExamSubmission whereExamStudentId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\ExamSubmission whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\ExamSubmission whereScore($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\ExamSubmission whereSolutions($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\ExamSubmission whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class ExamSubmission extends Model
{
    //
}
