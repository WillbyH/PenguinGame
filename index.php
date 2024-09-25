<style>
  body { background: #000; margin: 0; }
  ::-webkit-scrollbar { display: none; }
  canvas { background: white; margin: 0px; display: inline-block; }
  #full { width: 100%; height: 100%; margin: 0; }
  @font-face {
    font-family: "Lilita";
    src: url('fonts/LilitaOne-Regular.ttf') format('truetype');
    font-weight: 400;
    font-style: normal;
  }
</style>
<center>
  <div id="full"><canvas></canvas></div>
</center>

<?php
  $cglocation = "cg/";
  if (file_exists("cglocation.txt")) {
    $cglocation = file_get_contents("cglocation.txt");
  }
?>
<script src="scripts/fmod/fmodstudio.js" type="text/javascript"></script>
<script src="<?php echo $cglocation?>choreograph.js" type="text/javascript"></script>
<script src="<?php echo $cglocation?>plugins/audio.js" type="text/javascript"></script>
<?php if (file_exists("cglocation.txt")) { echo '<script src="' . $cglocation . 'plugins/visualisation.js" type="text/javascript"></script>'; } ?>
<?php if (file_exists("cglocation.txt")) { echo '<script src="' . $cglocation . 'plugins/develop.js" type="text/javascript"></script>'; } ?>
<script src="<?php echo $cglocation?>plugins/tilemaps.js" type="text/javascript"></script>
<script src="<?php echo $cglocation?>plugins/tiledconnector.js" type="text/javascript"></script>
<script src="<?php echo $cglocation?>plugins/physics.js" type="text/javascript"></script>
<script src="<?php echo $cglocation?>plugins/fmodconnector.js" type="text/javascript"></script>
<script src="scripts/setup.js" type="text/javascript"></script>
<script src="scripts/player.js" type="text/javascript"></script>
<script src="scripts/npc.js" type="text/javascript"></script>
<script src="scripts/interface.js" type="text/javascript"></script>
<script src="scripts/penguin.js" type="text/javascript"></script>