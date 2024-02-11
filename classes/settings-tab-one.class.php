<?php
namespace BigupWeb\Tiltomatic;

/**
 * Settings Tab One.
 *
 * @package tiltomatic
 */
class Settings_Tab_One {

	/**
	 * Settings page slug to add with add_submenu_page().
	 */
	public const PAGE = 'tiltomatic-settings-tab-one';

	/**
	 * Settings group name called by settings_fields().
	 */
	public const GROUP = 'tiltomatic_group_tab_one';

	/**
	 * The plugin settings name.
	 */
	public const OPTION = 'tiltomatic_settings_tab_one';

	/**
	 * The plugin settings stored in the wp_options table.
	 */
	public $settings;


	/**
	 * Output the content for this tab.
	 */
	public static function output_tab() {
		echo '<p>Thank you for using this plugin! 😊</p>';
		echo '<p>Please report bugs here: <a href="#">Github issues</a></p>';
	}
}
