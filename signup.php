<?php require 'functions.php'; ?>
<?php require 'check_login_correct.php'; ?>
<?php 
    $res = -1;

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $res = register($_POST['login'],$_POST['password']);
        if ($res == 0) {
            setcookie("user",hash("sha256",$_POST['login'] . $_POST['password']),time()+86400);
        }
    }
?>
<?php require_once 'meta_head.php'; ?>
    <body class="d-flex flex-column text-center h-100">
        <?php require_once 'header.php'; ?>
        <main class="container-sm w-50" role="main">
            <form action="signup.php" method="post">
                <img class="mb-4" src="cat-no-bg.png" width="72">
                <h1 class="h3 mb-3 fw-normal">Please sign up</h1>
                <?php if ($res != -1): ?>
                    <!-- 0 - fine
                    1 - already exists
                    2 - no login
                    3 - no pass
                    255 - ALL IS BROKEN -->
                    <?php 
                        if ($res == 0) {
                            echo '<div class="border border-success rounded-pill bg-success p-2 m-2" style="--bs-bg-opacity: .05;">';
                            echo '<p class="text-success m-1">';
                        } else {
                            echo '<div class="border border-danger rounded-pill bg-danger p-2 m-2" style="--bs-bg-opacity: .05;">';
                            echo '<p class="text-danger m-1">';
                        }
                            switch ($res) {
                                case 0:
                                    echo 'Registered successfully! Redirecting to the <a href="/">main page...</a>';
                                    echo '<script>
                                            function sleep (time) {
                                                return new Promise((resolve) => setTimeout(resolve, time));
                                            }
                                            sleep(2000).then(() => {
                                                window.location.replace("/")
                                            })
                                        </script>';
                                    break;
                                case 1:
                                    echo "This user already exists.";
                                    break;
                                case 2:
                                    echo "No login provided.";
                                    break;
                                case 3:
                                    echo "No password provided.";
                                    break;
                                case 255:
                                    echo "Unknown error. Contact the administrator.";
                                    break;
                                }
                        echo '</p>';
                        echo '</div>';
                    ?>
                <?php endif ?>
                <div class="form-floating">
                    <input type="text" class="form-control" id="login" placeholder="Login" name="login">
                    <label for="login">Login</label>
                </div>
                <div class="form-floating">
                    <input type="password" class="form-control" id="password" placeholder="Password" name="password">
                    <label for="password">Password</label>
                </div>
                <button class="w-50 btn btn-lg btn-primary m-2" type="submit">Sign up</button>
            </form>
        </main>    
        <?php require_once 'footer.php'; ?>
    </body>
</html>