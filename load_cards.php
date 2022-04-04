<?php include_once 'functions.php'; ?>
<?php
    $cards = load_cards($_GET["hash"]);
    echo json_encode($cards);
?>