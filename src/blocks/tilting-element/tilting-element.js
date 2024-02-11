import { __ } from '@wordpress/i18n'
import { registerBlockType } from '@wordpress/blocks'
import { Logo } from './svg'
import Edit from './edit'
import save from './save'
import metadata from './block.json'
import './tilting-element.scss'

registerBlockType( metadata.name, {
	...metadata,
	icon: Logo,
	edit: Edit,
	save,
} )
