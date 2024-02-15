import { useBlockProps, InnerBlocks } from '@wordpress/block-editor'

export default function save( { attributes } ) {

	const {
		tiltRangeX,
		tiltRangeY,
		perspective,
		isolatedPerspective,
		enabled,
		overflowSelector
	} = attributes

	const containerClassName = 'tilt_container'

	const overflowSelectorConditionalProp = overflowSelector ? { 'data-overflow-selector': overflowSelector } : {}

	const perspectiveConditionalStyle = isolatedPerspective ? {} : { style: { perspective: perspective } }

	const blockProps = useBlockProps.save( {
		className: containerClassName,
		...perspectiveConditionalStyle
	} )

	return (
		<div
			{ ...blockProps }
			{ ...overflowSelectorConditionalProp }
			data-tilt-range-x={ tiltRangeX }
			data-tilt-range-y={ tiltRangeY }
			data-tilt-enabled={ enabled }
		>
			<InnerBlocks.Content />
		</div>
	)
}
