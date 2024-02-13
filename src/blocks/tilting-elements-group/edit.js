import { __ } from '@wordpress/i18n'
import { PropTypes } from 'prop-types'
import { PanelBody, RangeControl, CheckboxControl, SelectControl } from '@wordpress/components'
import { useBlockProps, InnerBlocks, InspectorControls } from '@wordpress/block-editor'

export default function Edit( { attributes, setAttributes } ) {

	const {
		maxAngleX,
		maxAngleY,
		perspective,
		isolatedPerspective,
		enabled,
		preventOverflow,
		overflowSelector
	} = attributes

	const containerSelector = '.tilt_container',
		  childSelector     = '.tilt'

	// Overflow target select control values.
	const overflowSelectorOptions = [
		{ value: containerSelector, label: "Tilt Container" },
		{ value: 'body', label: "Document Body" }
	]

	const styles = {
		'perspective': perspective,
		// ...{ ( preventOverflow && overflowSelector === containerSelector ) ? ( 'perspective': perspective ) : }
	}

	const blockProps = useBlockProps( {
		className: 'tilt_container',
		style: styles
	} )

	return (
		<>

			<InspectorControls>
				<PanelBody
					title={ __( 'Settings' ) }
					initialOpen={ true } 
				>
					<RangeControl
						initialPosition={ 50 }
						label={ __( 'Maximum X-axis rotation', 'tiltomatic' ) }
						value={ maxAngleX }
						onChange={ ( newValue ) => { setAttributes( { maxAngleX: newValue, } ) } }
						max={ 90 }
						min={ 0 }
						help={ __( 'Set an X-axis angle limit for the animation.', 'tiltomatic' ) }
					/>
					<RangeControl
						initialPosition={ 50 }
						label={ __( 'Maximum Y-axis rotation', 'tiltomatic' ) }
						value={ maxAngleY }
						onChange={ ( newValue ) => { setAttributes( { maxAngleY: newValue, } ) } }
						max={ 90 }
						min={ 0 }
						help={ __( 'Set an Y-axis angle limit for the animation.', 'tiltomatic' ) }
					/>
					<RangeControl
						initialPosition={ 200 }
						label={ __( '3D perspective', 'tiltomatic' ) }
						value={ parseInt( perspective ) }
						onChange={ ( newValue ) => { setAttributes( { perspective: newValue + 'px', } ) } }
						max={ 1000 }
						min={ 0 }
						help={ __( 'Control the 3D perspective.', 'tiltomatic' ) }
					/>
					<CheckboxControl
						label={ __( 'Isolated perspective', 'tiltomatic' ) }
						checked={ isolatedPerspective }
						onChange={ ( newValue ) => { setAttributes( { isolatedPerspective: newValue, } ) } }
						help={ __( 'Wrap tilt elements in individual perspective containers.' ) }
					/>
					<CheckboxControl
						label={ __( 'Animation enabled', 'tiltomatic' ) }
						checked={ enabled }
						onChange={ ( newValue ) => { setAttributes( { enabled: newValue, } ) } }
					/>
					<CheckboxControl
						label={ __( 'Prevent overflow', 'tiltomatic' ) }
						checked={ preventOverflow }
						onChange={ ( newValue ) => { setAttributes( { preventOverflow: newValue, } ) } }
					/>
					{ preventOverflow &&
						<SelectControl
							label={ __( 'Overflow selector', 'tiltomatic' ) }
							labelPosition="top"
							title="Overflow selector"
							value={ overflowSelector }
							options={ overflowSelectorOptions }
							onChange={ ( newValue ) => setAttributes( { overflowSelector: newValue, } ) }
						/>
					}
				</PanelBody>
			</InspectorControls>

			<div
				{ ...blockProps }
				data-tilt-max-x={ maxAngleX }
				data-tilt-max-y={ maxAngleY }
			>
				<InnerBlocks />
			</div>

		</>
	)
}

Edit.propTypes = {
	attributes: PropTypes.object,
	setAttributes: PropTypes.func
}
