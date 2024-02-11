<?php
namespace BigupWeb\Tiltomatic;

/**
 * Settings Tab Two.
 *
 * @package tiltomatic
 */
class Settings_Tab_Two {

	/**
	 * Settings page slug to add with add_submenu_page().
	 */
	public const PAGE = 'tiltomatic-settings-tab-two';

	/**
	 * Settings group name called by settings_fields().
	 */
	public const GROUP = 'tiltomatic_group_tab_two';

	/**
	 * The plugin settings name.
	 */
	public const OPTION = 'tiltomatic_settings_tab_two';

	/**
	 * The plugin settings stored in the wp_options table.
	 */
	public $settings;


	/**
	 * Output the content for this tab.
	 */
	public static function output_tab() {
		echo '<p>Tab two settings</p>';
		settings_fields( self::GROUP );
		do_settings_sections( self::PAGE );
	}


	/**
	 * Register the settings.
	 */
	public function init() {

		$this->settings = get_option( self::OPTION );

		register_setting(
			self::GROUP,
			self::OPTION,
			array( $this, 'sanitize' )
		);

		// Developer.
		$section = 'developer';
		add_settings_section( $section, 'Developer', array( &$this, 'echo_intro_section_developer' ), $page );
			add_settings_field( 'debug', 'Enable debugging', array( &$this, 'echo_field_debug' ), $page, $section );
	}


	/**
	 * Output Form Fields - Developer Settings
	 */
	public function echo_intro_section_developer() {
		echo '<p>Settings for developers.</p>';
	}
	public function echo_field_debug() {
		$setting = 'bigup_forms_settings[debug]';
		printf(
			'<input type="checkbox" value="1" id="%s" name="%s" %s><label for="%s">%s</label>',
			$setting,
			$setting,
			isset( $this->settings['debug'] ) ? checked( '1', $this->settings['debug'], false ) : '',
			$setting,
			'Tick to enable debug logging.',
		);
	}


	/**
	 * Sanitise all settings callback.
	 *
	 * @param string $settings Serialised array of settings.
	 */
	public function sanitise( $settings ) {
		$sanitised = array();

		if ( isset( $settings['debug'] ) ) {
			$sanitised['debug'] = $this->sanitise_checkbox( $settings['debug'] );
		}

		return $sanitised;
	}


	/**
	 * Sanitise a checkbox.
	 *
	 * @param bool $checkbox Value from a checkbox input.
	 */
	private function sanitise_checkbox( $checkbox ) {
		$bool_checkbox = (bool) $checkbox;
		return $bool_checkbox;
	}
}
