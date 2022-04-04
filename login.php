<?php require 'functions.php'; ?>
<?php
    check_login_correct($_COOKIE);
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $res = auth($_POST['login'],$_POST['password']);
        if ($res == 0) {
            setcookie("user",hash("sha256",$_POST['login'] . $_POST['password']),time()+86400);
        }
        echo $res;
    }
?>