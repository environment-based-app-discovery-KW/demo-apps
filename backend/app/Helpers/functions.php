<?php

use phpseclib\Crypt\RSA;

function join_paths() {
    $paths = array();

    foreach (func_get_args() as $arg) {
        if ($arg !== '') { $paths[] = $arg; }
    }

    return preg_replace('#/+#','/',join('/', $paths));
}

function put_file($file_path)
{
    $hash = hash_file('sha256', $file_path);
    copy($file_path, join_paths(env('FILE_BUCKET_PATH'), $hash));
    return $hash;
}

function rrmdir($dir) {
    if (is_dir($dir)) {
        $objects = scandir($dir);
        foreach ($objects as $object) {
            if ($object != "." && $object != "..") {
                if (is_dir($dir."/".$object))
                    rrmdir($dir."/".$object);
                else
                    unlink($dir."/".$object);
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