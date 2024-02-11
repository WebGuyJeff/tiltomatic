<?php
namespace BigupWeb\Tiltomatic;

/**
 * Admin Settings Handler.
 *
 * @package tiltomatic
 * @author Jefferson Real <me@jeffersonreal.uk>
 * @copyright Copyright (c) 2023, Jefferson Real
 * @license GPL3+
 * @link https://jeffersonreal.uk
 */


/**
 * Tiltomatic - Admin Settings.
 *
 * Hook into the WP admin area and add menu settings pages.
 */
class Settings {


	/**
	 * Class Variables.
	 *
	 * PAGESLUG   - Page URI where the sub-menu will be.
	 * GROUPNAME  - Option group ID which is set when registering settings for this page.
	 * $admin_label - Menu label for the plugin.
	 * $parent_slug - Parent page URI.
	 */
	private const PAGESLUG  = 'tiltomatic';
	private const GROUPNAME = 'tiltomatic';
	private $admin_label;
	private $parent_slug;

	/**
	 * Holds the WP_Post object for the add_meta_boxes callback.
	 */
	public $post_obj = '';


	/**
	 * Init the class by hooking into the admin interface.
	 *
	 * do_settings() is hooked in  to 'init' instead of 'admin_init' to support GraphQL.
	 */
	public function __construct() {
		$this->admin_label = __( 'Tiltomatic', 'bigup-tiltomatic' );
		$this->parent_slug = Settings_Parent::PAGESLUG;
	}


	/**
	 * Add admin menu entry to sidebar
	 */
	public function register_admin_menu() {

		add_submenu_page(
			$this->parent_slug,                      // parent_slug
			$this->admin_label . ' Settings',        // page_title
			$this->admin_label,                      // menu_title
			'manage_options',                        // capability
			self::PAGESLUG,                          // menu_slug
			array( &$this, 'create_settings_page' ), // function
			null,                                    // position
		);

	}


	/**
	 * Echo a link to this plugin's settings page.
	 */
	public function echo_plugin_settings_link() {
		?>
		<a href="/wp-admin/admin.php?page=<?php echo esc_attr( self::PAGESLUG ); ?>">
			<?php echo esc_html( $this->admin_label ); ?> settings
		</a>
		<?php
	}


	/**
	 * Create Blocks Settings Page
	 */
	public function create_settings_page() {

		/* Get the active tab from the $_GET URL param. */
		$default_tab = null;
		$tab         = isset( $_GET['tab'] ) ? $_GET['tab'] : $default_tab;
		$slug        = self::PAGESLUG;
		?>

		<div class="wrap">
			<h1>
				<span class="dashicons-bigup-logo" style="font-size: 2em; margin-right: 0.2em;"></span>
				<?php echo esc_html( get_admin_page_title() ); ?>
			</h1>

			<p>
				<?php echo esc_html( __( 'These settings control Tiltomatic features.', 'bigup-tiltomatic' ) ); ?>
			</p>

			<?php settings_errors(); // Display the form save notices here. ?>

			<nav class="nav-tab-wrapper">
				<a
					href="?page=<?php echo esc_attr( $slug ); ?>"
					class="nav-tab 
					<?php
					if ( $tab === null ) :
						?>
						nav-tab-active<?php endif; ?>"
				>
					<?php echo esc_html( __( 'Info', 'bigup-tiltomatic' ) ); ?>
				</a>
				<a
					href="?page=<?php echo esc_attr( $slug ); ?>&tab=tab-2"
					class="nav-tab 
					<?php
					if ( $tab === 'tab-2' ) :
						?>
						nav-tab-active<?php endif; ?>"
				>
					<?php echo esc_html( __( 'Developer', 'bigup-tiltomatic' ) ); ?>
				</a>
			</nav>

			<div class="tab-content">
			<?php
			switch ( $tab ) :
				case 'tab-2':
					Settings_Tab_Two::output_tab();
					break;
				default:
					Settings_Tab_One::output_tab();
					break;
			endswitch;
			?>
			</div>

		</div>

		<?php
	}
}
