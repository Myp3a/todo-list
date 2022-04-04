<?php require 'functions.php'; ?>
<?php
    check_login_correct($_COOKIE);
    if (!empty($_COOKIE["user"])) { 
        $uid = get_user_by_hash($_COOKIE["user"]);
    }
    else {
       header('Location: /'); 
    }

    $card_id = $_POST['card_id'];
    $res = del_card($uid,$card_id);
    echo $res;
?>