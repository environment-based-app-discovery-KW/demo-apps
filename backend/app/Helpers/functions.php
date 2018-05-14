<?php

use Illuminate\Support\Facades\Input;
use phpseclib\Crypt\RSA;

function join_paths()
{
    $paths = array();

    foreach (func_get_args() as $arg) {
        if ($arg !== '') {
            $paths[] = $arg;
        }
    }

    return preg_replace('#/+#', '/', join('/', $paths));
}

function put_file($file_path)
{
    $hash = hash_file('sha256', $file_path);
    copy($file_path, join_paths(env('FILE_BUCKET_PATH'), $hash));
    return $hash;
}

function getUserPublicKey($appName = "")
{
    $public_key = Input::get("publicKey", "");
    $signature = Input::get("signature", "");
    $signed_content = Input::get("signedContent", "");
    if (!starts_with($signed_content, "APP:" . $appName . ":")) {
        return error("invalid signed content");
    }
    $timediff_s = abs(floatval(substr($signed_content, strlen($appName) + 5)) / 1000 - time());
    if ($timediff_s > 600) {
        return error("signature has expired");
    }

    if (!(verfiySignature($signature, $signed_content, $public_key))) {
        return error("invalid signature");
    }
    return $public_key;
}

function rrmdir($dir)
{
    if (is_dir($dir)) {
        $objects = scandir($dir);
        foreach ($objects as $object) {
            if ($object != "." && $object != "..") {
                if (is_dir($dir . "/" . $object))
                    rrmdir($dir . "/" . $object);
                else
                    unlink($dir . "/" . $object);
            }
        }
        rmdir($dir);
    }
}

function verfiySignature($signature, $signedContent, $publicKey)
{
    $signature = preg_replace('/\s/', '', $signature);
    $publicKey = preg_replace('/\s/', '', $publicKey);

    $rsa = new RSA();
    $rsa->loadKey(base64_decode($publicKey));
    $rsa->setPublicKey();
    $rsa->setSignatureMode(RSA::SIGNATURE_PKCS1);
    return $rsa->verify($signedContent, base64_decode($signature));
}

function error($msg, $code = 500)
{
    return Response::json(['errMsg' => $msg], $code);
}