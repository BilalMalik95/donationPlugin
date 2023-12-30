<?php
$js_file_url = plugins_url('../js/main.js', __FILE__);
?>
<script type="module" src="<?= $js_file_url ?>?ver=<?= time(); ?>"></script>