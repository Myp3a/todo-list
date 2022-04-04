<?php include_once 'functions.php'; ?>
<?php
    $uid = get_user_by_hash($_GET["hash"]);
    echo $uid;
?>