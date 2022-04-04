<?php require 'functions.php'; ?>
<?php
    check_login_correct($_COOKIE);
    if (!empty($_COOKIE["user"])) { 
        $id = get_user_by_hash($_COOKIE["user"]);
    }
    else {
       header('Location: /login.php'); 
    }
?>
<?php
    $res = del_card($id,$_GET['card_id']);
    if ($res == 0) {
        header('Location: /index.php'); 
    } else {
        require_once 'meta_head.php'; ?>
        <body class="d-flex flex-column h-100">
        <?php
        require_once 'header.php';
        echo '<div class="border border-danger rounded-pill bg-danger p-2 m-2" style="--bs-bg-opacity: .05;">';
        echo '<p class="text-danger text-center m-1">';
        switch ($res) {
            case 1:
                echo "No card ID specified.";
                break;
            case 2:
                echo "Failed to delete card (Wrong ID or no permissions?)";
                break;
            case 255:
                echo "Unknown error. Contact the administrator.";
                break;
        }
        echo '</p>';
        echo '</div>';
        require_once 'footer.php';
    }