<?php
namespace BigupWeb\Tiltomatic;

/**
 * Register blocks included with this theme.
 *
 * @package tiltomatic
 */
class Blocks {

	/**
	 * Blocks root relative path.
	 *
	 * @var string
	 */
	const BLOCKS_REL_PATH = 'build/blocks';

	/**
	 * Blocks root absolute path.
	 *
	 * @var string
	 */
	private string $blocks_abs_path = '';

	/**
	 * Block directory names.
	 *
	 * @var array
	 */
	private array $names = array();


	/**
	 * Setup the class.
	 */
	public function __construct() {
		$this->blocks_abs_path = trailingslashit( BIGUPTILTOMATIC_PATH . self::BLOCKS_REL_PATH );

		$all_children = scandir( $this->blocks_abs_path );
		$dir_names    = array_filter( preg_replace( '/\..*/', '', $all_children ) );
		if ( is_array( $dir_names ) ) {
			$this->names = $dir_names;
		}
	}


	/**
	 * Register all blocks.
	 */
	public function register_all() {
		if ( count( $this->names ) === 0 ) {
			return;
		}
		foreach ( $this->names as $name ) {
			$result = register_block_type_from_metadata( $this->blocks_abs_path . $name );
			if ( false === $result ) {
				error_log( "ERROR: Block registration failed for '{$name}'" );

			}
		}
	}
}
