<?php
namespace BigupWeb\Tiltomatic;

/**
 * Plugin Name: Bigup Web: Tiltomatic
 * Plugin URI: https://jeffersonreal.uk
 * Description: Apply a cursor-following tilt animation to any element!
 * Version: 0.0.1
 * Author: Jefferson Real
 * Author URI: https://jeffersonreal.uk
 * License: GPL3
 *
 * @package bigup_contact_form
 * @version 0.0.1
 * @author Jefferson Real <me@jeffersonreal.uk>
 * @copyright Copyright (c) 2023, Jefferson Real
 * @license GPL3+
 * @link https://jeffersonreal.uk
 */

$settings     = get_option( 'bigup_tiltomatic_settings' );
$enable_debug = ( $settings && array_key_exists( 'debug', $settings ) && $settings['debug'] ) ? true : false;

// Set global constants.
define( 'BIGUPTILTOMATIC_DEBUG', $enable_debug );
define( 'BIGUPTILTOMATIC_PATH', trailingslashit( __DIR__ ) );
define( 'BIGUPTILTOMATIC_URL', trailingslashit( get_site_url( null, strstr( __DIR__, '/wp-content/' ) ) ) );

// Register namespaced autoloader.
$namespace = 'BigupWeb\\Tiltomatic\\';
$root      = BIGUPTILTOMATIC_PATH . 'classes/';
require_once $root . 'autoload.php';

// Setup the plugin.
$Init = new Init();
$Init->setup();
