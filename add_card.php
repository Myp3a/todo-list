<?php require 'functions.php'; ?>
<?php 
    check_login_correct($_COOKIE);
    if (!empty($_COOKIE["user"])) { 
        $id = get_user_by_hash($_COOKIE["user"]);
    }
    else {
       header('Location: /login.php'); 
    } ?>
<?php
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
        if ($res == 0) {
            header('Location: /index.php');
        }
    }
?>
<?php require_once 'meta_head.php'; ?>
    <body class="d-flex flex-column h-100">
        <?php require_once 'header.php'; ?>
        <main class="container-fluid w-50" role="main">
            <?php
                if ($res != -1) {
                    echo '<div class="border border-danger rounded-pill bg-danger p-2 m-2" style="--bs-bg-opacity: .05;">';
                    echo '<p class="text-danger text-center m-1">';
                    switch ($res) {
                        case 1:
                            echo "No user ID exists.";
                            break;
                        case 2:
                            echo "You must specify task name.";
                            break;
                        case 255:
                            echo "Unknown error. Contact the administrator.";
                            break;
                    }
                    echo '</p>';
                    echo '</div>';
                }
            ?>
            <form action="add_card.php" method="post" enctype="multipart/form-data">
                <div class="mb-3">
                    <label for="name" class="form-label">Task name</label>
                    <input type="text" class="form-control" id="name" aria-describedby="namehelp" name="name">
                    <div id="namehelp" class="form-text">A name of the task.</div>
                </div>
                <div class="mb-3">
                    <label for="description" class="form-label">Description</label>
                    <textarea class="form-control" id="description" aria-describedby="descrhelp" name="description"></textarea>
                    <div id="descrhelp" class="form-text">A long description for a task.</div>
                </div>
                <div class="mb-3">
                    <label class="form-check-label" for="imgfile">Task image</label>
                    <input type="file" class="form-control" id="imgfile" aria-describedby="imghelp" name="imgfile">
                    <div id="imghelp" class="form-text">An image to show on task background.</div>
                </div>
                <button type="submit" class="btn btn-primary">Add</button>
            </form>
        </main>
        <?php require_once 'footer.php'; ?>
    </body>
</html>