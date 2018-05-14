<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * App\MenuOrder
 *
 * @mixin \Eloquent
 * @property int $id
 * @property string $user_public_key
 * @property int $amount_paid
 * @property string $content
 * @property \Carbon\Carbon|null $created_at
 * @property \Carbon\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|\App\MenuOrder whereAmountPaid($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\MenuOrder whereContent($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\MenuOrder whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\MenuOrder whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\MenuOrder whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\MenuOrder whereUserPublicKey($value)
 */
class MenuOrder extends Model
{
    //
}
