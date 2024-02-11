import { __ } from '@wordpress/i18n'
import { registerBlockCollection } from '@wordpress/blocks'
import {
	Logo
} from '../svg/svg'


/**
 * Register block collection.
 * 
 * COLLECTIONS ARE NOT CATEGORIES!
 * @link https://make.wordpress.org/core/2020/02/27/block-collections/
 * 
 * Blocks are displayed in a collection when the namespace matches the collection name.
 * e.g. `registerBlockType( '<namespace>/some-awesome-block', ... )`.
 */
const registerCollection = () => {
	registerBlockCollection(
		'animation', // Block namespace.
		{
			title: __( 'Animation' ),
			icon: Logo
		}
	)
}

export { registerCollection }
