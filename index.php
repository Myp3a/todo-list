<?php require 'functions.php'; ?>
<?php 
    check_login_correct($_COOKIE);
    if (!empty($_COOKIE["user"])) { 
        $id = get_user_by_hash($_COOKIE["user"]);
    }
    else {
       header('Location: /login.php'); 
    } ?>
<?php require_once 'meta_head.php'; ?>
    <body class="d-flex flex-column h-100">
        <?php require_once 'header.php'; ?>
        <main class="container-fluid" role="main">
            <div id="controls" class="d-flex flex-row">
                <a href="/add_card.php" class="btn btn-primary mb-3 ms-1">Добавить</a>
            </div>
            <div id="cards" class="d-flex flex-row flex-wrap">
                <?php 
                    load_cards($_COOKIE["user"]);
                ?>
            </div>
        </main>
        <?php require_once 'footer.php'; ?>
    </body>
</html>