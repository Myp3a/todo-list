<nav id="navbar" class="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
    <a class="navbar-brand ps-3 pe-3">
        <img src="cat-no-bg.png" width="64" class="d-inline-block">
        Aufgabenliste
    </a>
    <button class="navbar-toggler m-2" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNavDropdown">
        <ul class="navbar-nav mr-auto">
            <li class="nav-item">
                <a class="nav-link active" aria-current="page" href="/">Home</a>
            </li>
            <li class="nav-item">
                <?php
                    if(isset($_COOKIE['user'])) {
                        echo '<a class="nav-link" href="/">Meine Aufgaben</a>';
                    } else {
                        echo '<a class="nav-link" href="/login.php">Login</a>';
                    }
                ?>
            </li>
            <li class="nav-item">
                <?php
                    if(isset($_COOKIE['user'])) {
                        echo '<a class="nav-link" href="/logout.php">Log out</a>';
                    } else {
                        echo '<a class="nav-link" href="/signup.php">Sign up</a>';
                    }
                ?>
            </li>
        </ul>
    </div>
</nav>