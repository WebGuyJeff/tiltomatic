import { useBlockProps, InnerBlocks } from '@wordpress/block-editor'

export default function save() {

	const blockProps = useBlockProps.save( {
		className: 'tilt_container'
	} )

	return (
		<div { ...blockProps }>
			<InnerBlocks.Content />
		</div>
	)
}
