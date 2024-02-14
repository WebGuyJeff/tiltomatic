import { useBlockProps, InnerBlocks } from '@wordpress/block-editor'

export default function save( { attributes } ) {

	const {
		tiltRangeX,
		tiltRangeY,
		perspective,
		isolatedPerspective,
		enabled,
		overflowMode
	} = attributes

	const containerClassName = 'tilt_container'

	const blockProps = useBlockProps.save( {
		className: containerClassName,
		style: {
			perspective: perspective
		}
	} )

	return (
		<div
			{ ...blockProps }
			data-tilt-range-x={ tiltRangeX }
			data-tilt-range-y={ tiltRangeY }
			data-overflow-mode={ overflowMode }
		>
			<InnerBlocks.Content />
		</div>
	)
}
