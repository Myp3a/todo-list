<?php require 'functions.php'; ?>
<?php 
    check_login_correct($_COOKIE);
    if (!empty($_COOKIE["user"])) { 
        $id = get_user_by_hash($_COOKIE["user"]);
    }
    else {
       header('Location: /'); 
    } 

    $res = -1;
    $img = NULL;
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        if (!($_FILES['imgfile']['size'] == 0)) {
            $target_dir = "task_img/";
            $file_hash = md5_file($_FILES['imgfile']['tmp_name']);
            $ext = pathinfo($_FILES['imgfile']['name'], PATHINFO_EXTENSION);
            $target_file = $target_dir . $file_hash . "." . $ext;
            $uploadOk = 1;
            $imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));
            $check = getimagesize($_FILES["imgfile"]["tmp_name"]);
            if($check !== false) {
                move_uploaded_file($_FILES["imgfile"]["tmp_name"], $target_file);
                $uploadOk = 1;
                $img = $target_file;
            } else {
                $uploadOk = 0;
            }  
        }
        $res = add_card($_POST['name'],$_POST['description'],$img,$id);
        // 0 - ok
        // 1 - no UID
        // 2 - no name (only name mandatory)
        // 255 - FUCKUP
        echo $res;
    }
?>