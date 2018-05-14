<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * App\SignUpRecord
 *
 * @property int $id
 * @property string $name
 * @property string $mobile
 * @property string $email
 * @property string $comments
 * @property string $extra
 * @property \Carbon\Carbon|null $created_at
 * @property \Carbon\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|\App\SignUpRecord whereComments($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\SignUpRecord whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\SignUpRecord whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\SignUpRecord whereExtra($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\SignUpRecord whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\SignUpRecord whereMobile($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\SignUpRecord whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\SignUpRecord whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class SignUpRecord extends Model
{
    //
}
