<?php
    function make_card($card_id, $title, $pic, $text, $done) {
        if ($done == 0) {
            echo "<div class=\"card m-1 shadow\" style=\"width: 18rem;\" data-cardid=\"$card_id\">
                <img src=\"$pic\" class=\"card-img-top\">
                <div class=\"card-body\">
                    <h5 class=\"card-title\">$title</h5>
                    <p class=\"card-text text-muted\">$text</p>
                    <a href=\"toggle_card.php?card_id=$card_id&state=1\" class=\"btn btn-danger\">Сделано</a>
                    <a href=\"del_card.php?card_id=$card_id\" class=\"btn btn-danger\">Удалить</a>
                </div>
            </div>";
        }
        else {
            echo "<div class=\"card m-1 shadow opacity-50\" style=\"width: 18rem;\" data-cardid=\"$card_id\">
                <img src=\"$pic\" class=\"card-img-top opacity-50\">
                <div class=\"card-body\">
                    <h5 class=\"card-title text-decoration-line-through\">$title</h5>
                    <p class=\"card-text text-muted text-decoration-line-through\">$text</p>
                    <a href=\"toggle_card.php?card_id=$card_id&state=0\" class=\"btn btn-success\">Сделано</a>
                    <a href=\"del_card.php?card_id=$card_id\" class=\"btn btn-danger\">Удалить</a>
                </div>
            </div>";
        }
        
    }

    function db_connect() {
        $servername = "localhost";
        $username = "root";
        $password = "";

        try {
            $conn = new PDO("mysql:host=$servername;dbname=abyr", $username, $password);
            // set the PDO error mode to exception
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            return $conn;
        } catch(PDOException $e) {
            echo "Connection failed: " . $e->getMessage();
        }
    }

    function auth($login, $pass) {
        if (empty($login)) {
            return 2;
        }

        if (empty($pass)) {
            return 3;
        }

        $conn = db_connect();

        try {
            $stmt = $conn->prepare('SELECT * FROM users WHERE login = :login AND password = :pass');
            $stmt->bindParam(':login',$login);
            $stmt->bindParam(':pass',$pass);
            
            $stmt->execute();
            if ($stmt->rowCount() > 0) {
                return 0;
            } else {
                return 1;
            }
        } catch(PDOException $e) {
            return 255;
        }   
    }

    function get_user_by_hash($hash) {
        $conn = db_connect();

        try {
            $stmt = $conn->prepare('SELECT * FROM users WHERE hash = :hash');
            $stmt->bindParam(':hash',$hash);
            $stmt->execute();
            if ($stmt->rowCount() == 1) {
                foreach ($stmt as $row) {
                    return($row['id']);
                }
            } else {
                return 0;
            }
        } catch(PDOException $e) {
            return -1;
        }
    }

    function register($login, $pass) {
        if (empty($login)) {
            return 2;
        }

        if (empty($pass)) {
            return 3;
        }

        $hash = hash("sha256",$login . $pass);
        $res = get_user_by_hash($hash);
        if ($res != 0) {
            return 1;
        }

        $conn = db_connect();

        try {
            $stmt = $conn->prepare('INSERT INTO users (login, password, hash) VALUES (:login, :password, :hash)');
            $stmt->bindParam(':hash',$hash);
            $stmt->bindParam(':password',$pass);
            $stmt->bindParam(':login',$login);
            $stmt->execute();
            return 0;
        } catch(PDOException $e) {
            return 255;
        }
    }

    function load_cards($hash) {
        $uid = get_user_by_hash($hash);

        $conn = db_connect();

        try {
            $stmt = $conn->prepare('SELECT * FROM tasks WHERE user_id = :uid');
            $stmt->bindParam(':uid',$uid);
            $stmt->execute();
        } catch(PDOException $e) {
            return 255;
        }

        $cards = $stmt->fetchAll();

        foreach ($cards as $card) {
            make_card($card['id'], $card["task"],$card["img_path"],$card["descr"],$card["done"]);
        }
    }

    function add_card($name,$descr,$img,$uid) {
        if (empty($name)) {
            return 2;
        }
        if (empty($descr)) {
            $descr = "";
        }
        if (empty($img)) {
            $img = "task_img/dickcat-kel.jpg";
        }
        if (empty($uid)) {
            return 1;
        }

        $conn = db_connect();

        try {
            $stmt = $conn->prepare('INSERT INTO tasks (user_id,task,descr,img_path) VALUES (:uid,:name,:descr,:img)');
            $stmt->bindParam(':uid',$uid);
            $stmt->bindParam(':name',$name);
            $stmt->bindParam(':descr',$descr);
            $stmt->bindParam(':img',$img);
            $stmt->execute();
            return 0;
        } catch(PDOException $e) {
            return 255;
        }
    }

    function del_card($uid, $card_id) {
        if (empty($card_id)) {
            return 1;
        }

        $conn = db_connect();

        try {
            $stmt = $conn->prepare('DELETE FROM tasks WHERE user_id=:uid AND id=:card_id');
            $stmt->bindParam(':card_id',$card_id);
            $stmt->bindParam(':uid',$uid);
            $stmt->execute();
            $count = $stmt->rowCount();
            if ($count == 0) {
                return 2;
            } else {
                return 0;
            }
        } catch(PDOException $e) {
            return 255;
        }

    }

    function toggle_card($uid, $card_id, $state) {
        if (empty($card_id)) {
            return 2;
        }
        if (!is_numeric($state)) {
            return 3;
        }

        $conn = db_connect();

        try {
            $stmt = $conn->prepare('UPDATE tasks SET done=:state WHERE user_id=:uid AND id=:card_id');
            $stmt->bindParam(':state',$state,PDO::PARAM_INT);
            $stmt->bindParam(':card_id',$card_id);
            $stmt->bindParam(':uid',$uid);
            $stmt->execute();
            $stmt->debugDumpParams();
            $count = $stmt->rowCount();
            if ($count == 0) {
                return 1;
            } else {
                return 0;
            }
        } catch(PDOException $e) {
            return 255;
        }
    }

    function check_login_correct($cookies) {
        if (isset($cookies["user"])) {
            $uid = get_user_by_hash($cookies["user"]);
            if ($uid == 0) {
                setcookie("user", "", 1);
                unset($cookies["user"]);
            }
        }
    }
?>