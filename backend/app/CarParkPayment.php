<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * App\CarParkPayment
 *
 * @mixin \Eloquent
 * @property int $id
 * @property string $user_public_key
 * @property string $license_plate_number
 * @property int $amount_paid
 * @property \Carbon\Carbon|null $created_at
 * @property \Carbon\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|\App\CarParkPayment whereAmountPaid($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\CarParkPayment whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\CarParkPayment whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\CarParkPayment whereLicensePlateNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\CarParkPayment whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\CarParkPayment whereUserPublicKey($value)
 */
class CarParkPayment extends Model
{
    //
}
