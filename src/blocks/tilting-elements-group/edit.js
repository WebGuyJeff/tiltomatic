import { __ } from '@wordpress/i18n'
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor'
import './tilting-elements-group-editor.scss'

export default function Edit() {

	const blockProps = useBlockProps( {
		className: 'tilt_container'
	} )

	return (
		<div { ...blockProps }>
			<InnerBlocks />
		</div>
	)
}
