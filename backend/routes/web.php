<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::group(['prefix' => 'car-park'], function () {
    Route::post('pay', 'CarParkController@pay');
    Route::post('order', 'CarParkController@order');
});

Route::group(['prefix' => 'sign-up'], function () {
    Route::post('/', 'SignUpController@index');
});

Route::group(['prefix' => 'exam'], function () {
    Route::post('/get-user-info', 'ExamController@getUserInfo');
    Route::post('/set-user-info', 'ExamController@setUserInfo');
    Route::get('/get-paper', 'ExamController@getPaper');
});