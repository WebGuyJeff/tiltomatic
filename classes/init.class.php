<?php
namespace BigupWeb\Tiltomatic;

/**
 * Tiltomatic - Initialisation.
 *
 * Setup styles and functionality for this plugin.
 *
 * @package tiltomatic
 * @author Jefferson Real <me@jeffersonreal.uk>
 * @copyright Copyright (c) 2023, Jefferson Real
 * @license GPL3+
 * @link https://jeffersonreal.uk
 */

// WordPress dependencies.
use function add_action;


class Init {


	/**
	 * Setup the plugin by registering all hooks.
	 */
	public function setup() {
		add_action( 'admin_init', array( new Settings_Tab_One(), 'init' ), 10, 0 );
		add_action( 'admin_init', array( new Settings_Tab_Two(), 'init' ), 10, 0 );
		add_action( 'admin_menu', array( new Settings_Parent(), 'register_admin_menu' ), 1, 0 );
		$Settings = new Settings();
		add_action( 'admin_menu', array( &$Settings, 'register_admin_menu' ), 99, 0 );
		add_action( 'bigup_settings_dashboard_entry', array( &$Settings, 'echo_plugin_settings_link' ), 10, 0 );
		add_action( 'admin_enqueue_scripts', array( $this, 'admin_scripts_and_styles' ), 10, 0 );
		add_action( 'enqueue_block_editor_assets', array( $this, 'editor_scripts_and_styles' ), 10, 0 );
		add_action( 'init', array( new Blocks(), 'register_all' ), 10, 0 );
	}


	/**
	 * Register and enqueue admin scripts and styles.
	 */
	public function admin_scripts_and_styles() {
		if ( ! wp_script_is( 'bigup_icons', 'registered' ) ) {
			wp_register_style(
				'bigup_icons',
				BIGUPTILTOMATIC_URL . 'dashicons/css/bigup-icons.css',
				array(),
				filemtime( BIGUPTILTOMATIC_PATH . 'dashicons/css/bigup-icons.css' ),
				'all'
			);
		}
		if ( ! wp_script_is( 'bigup_icons', 'enqueued' ) ) {
			wp_enqueue_style( 'bigup_icons' );
		}

		global $pagenow;
		$slug = plugin_basename( BIGUPTILTOMATIC_PATH );
		if ( isset( $_GET['page'] ) && $_GET['page'] === $slug ) {
			// We're now on the admin page of this plugin.
		}
	}

	/**
	 * Register and enqueue editor scripts and styles.
	 */
	public function editor_scripts_and_styles() {
		wp_enqueue_script( 'tiltomatic_editor_js', BIGUPTILTOMATIC_URL . 'build/js/tiltomatic-editor.js', array(), filemtime( BIGUPTILTOMATIC_PATH . 'build/js/tiltomatic-editor.js' ), true );
	}
}
