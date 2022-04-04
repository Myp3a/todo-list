<?php require 'functions.php'; ?>
<?php
    check_login_correct($_COOKIE);
    if (!empty($_COOKIE["user"])) { 
        $uid = get_user_by_hash($_COOKIE["user"]);
    }
    else {
       header('Location: /'); 
    }

    $card_id = $_POST["card_id"];
    $state = $_POST["state"];
    $res = toggle_card($uid,$card_id,$state);
    echo $res;
?>