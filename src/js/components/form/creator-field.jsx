import cx from 'classnames';
import PropTypes from 'prop-types';
import React, { forwardRef, memo, useImperativeHandle, useMemo, useCallback, useRef, useState } from 'react';

import Button from '../ui/button';
import Editable from '../ui/editable';
import Field from './field';
import Icon from '../ui/icon';
import Input from './input';
import SelectInput from './select';
import { isTriggerEvent } from '../../common/event';
import { omit, pick } from '../../immutable';
import { SelectDivider, SelectOption } from '../ui/select';

const CreatorTypeSelector = memo(forwardRef((props, ref) => {
	const { creatorsCount, index, isActive, isDisabled, onCancel, onClick, onCommit, onFocus,
	onReorder, options, value, ...rest } = props;

	const isFirst = index === 0;
	const isLast = index === creatorsCount - 1;

	const handleMoveTop = useCallback(ev => {
		if(ev.type === 'mousedown' || isTriggerEvent(ev)) {
			onReorder(index, 0, true);
			ev.stopPropagation();
		}
	}, [index, onReorder]);

	const handleMoveUp = useCallback(ev => {
		if(ev.type === 'mousedown' || isTriggerEvent(ev)) {
			onReorder(index, index -1, true);
			ev.stopPropagation();
		}
	}, [index, onReorder]);

	const handleMoveDown = useCallback(ev => {
		if(ev.type === 'mousedown' || isTriggerEvent(ev)) {
			onReorder(index, index +1, true);
			ev.stopPropagation();
		}
	}, [index, onReorder]);

	return (
		<SelectInput
			className="form-control form-control-sm"
			isActive={ isActive }
			onCancel={ onCancel }
			onChange={ () => true }
			onCommit={ onCommit }
			onClick={ onClick }
			onFocus={ onFocus }
			options={ options }
			ref={ ref }
			isDisabled = { isDisabled }
			value={ value }
			{ ... pick(rest, p => p.startsWith('data-')) }
		>
			{ creatorsCount > 1 && (
				<React.Fragment>
					<SelectDivider />
					{ (index > 1) && (
						<SelectOption
						onTrigger={ handleMoveTop }
						option={ { label: 'Move to Top', value: '_top' } }
					/> ) }
					{ !isFirst && (
						<SelectOption
						onTrigger={ handleMoveUp }
						option={ { label: 'Move Up', value: '_up' } }
					/> ) }
					{ !isLast && (
						<SelectOption
						onTrigger={ handleMoveDown }
						option={ { label: 'Move Down', value: '_down' } }
					/> ) }
				</React.Fragment>
			) }
		</SelectInput>
	);
}));

CreatorTypeSelector.displayName = 'CreatorTypeSelector';

CreatorTypeSelector.propTypes = {
	creatorsCount: PropTypes.number,
	index: PropTypes.number,
	isActive: PropTypes.bool,
	isDisabled: PropTypes.bool,
	onCancel: PropTypes.func,
	onClick: PropTypes.func,
	onCommit: PropTypes.func,
	onFocus: PropTypes.func,
	onReorder: PropTypes.func,
	options: PropTypes.array,
	value: PropTypes.string,
};

const CreatorFieldInputWrap = memo(forwardRef((props, ref) => {
	const { active, creator, index, inModal, isForm, isReadOnly, label, name, onCancel, onAddMany,
	onEditableCommit, onFieldClick, onFieldFocus, } = props;
	const ignoreNextChange = useRef(null);
	const shouldUseEditable = !isForm && !inModal;

	const handleEditableCommit = useCallback((newValue, hasChanged, srcEvent) => {
		if(ignoreNextChange.current !== srcEvent.target) {
			onEditableCommit(newValue, hasChanged, srcEvent);
		}
		ignoreNextChange.current = null;

	}, [onEditableCommit]);

	const handlePaste = useCallback(ev => {
		const clipboardData = ev.clipboardData || window.clipboardData;
		const pastedData = clipboardData.getData('Text');

		if(inModal || !pastedData.includes('\n')) {
			return;
		}

		ev.preventDefault();
		const entries = pastedData.split('\n');
		const additionalCreators = entries
			.slice(0, -1)
			.map(entry => entry.split(' '))
			.map(entry => entry.length > 1 ? ({
					lastName: entry.length > 0 ? entry[entry.length - 1] : '',
					firstName: entry.slice(0, entry.length - 1).join(' '),
					creatorType: creator.creatorType
				}) : ({
					name: entry[0], creatorType: creator.creatorType
			}));
		const { selectionStart = 0, selectionEnd = 0 } = ev.currentTarget;
		const lastCreator = {
			...omit(creator, ['id']),
			[name]: creator[name].slice(0, selectionStart) + entries[entries.length - 1] + creator[name].slice(selectionEnd)
		};

		ignoreNextChange.current = ev.target;
		onAddMany([...additionalCreators, lastCreator], index, ev);
	}, [creator, index, inModal, name, onAddMany]);

	const formField = <Input
		aria-label={ label }
		autoFocus={ shouldUseEditable }
		className={ shouldUseEditable ? 'editable-control' : 'form-control form-control-sm' }
		data-field-name={ name }
		isDisabled={ isReadOnly }
		onCancel={ onCancel }
		onClick={ onFieldClick }
		onCommit={ handleEditableCommit }
		onFocus={ onFieldFocus }
		placeholder={ label }
		ref={ ref }
		resize={ (!inModal && name === 'lastName') ? 'horizontal' : null }
		selectOnFocus={ shouldUseEditable }
		tabIndex={ 0 }
		value={ creator[name] }
		onPaste={ handlePaste }
	/>;

	return shouldUseEditable ?
		<Editable
			data-field-name={ name }
			input={ formField }
			isActive={ active === name }
			isDisabled={ isReadOnly }
			onClick={ onFieldClick }
			onFocus={ onFieldFocus }
		/> :
		formField;
}));

CreatorFieldInputWrap.displayName = 'CreatorFieldInputWrap';
CreatorFieldInputWrap.propTypes = {
	active: PropTypes.string,
	creator: PropTypes.object,
	index: PropTypes.number,
	inModal: PropTypes.bool,
	isForm: PropTypes.bool,
	isReadOnly: PropTypes.bool,
	label: PropTypes.string,
	name: PropTypes.string,
	onAddMany: PropTypes.func,
	onCancel: PropTypes.func,
	onEditableCommit: PropTypes.func,
	onFieldClick: PropTypes.func,
	onFieldFocus: PropTypes.func,
};

const CreatorField = forwardRef((props, ref) => {
	const { className, creator, creatorsCount, creatorTypes, index, isCreateAllowed,
		isDeleteAllowed, isForm, isReadOnly, isSingle, isVirtual, onAddMany, onChange,
		onCreatorAdd, onCreatorRemove, onCreatorTypeSwitch, onDragStatusChange, onReorder,
		onReorderCancel, onReorderCommit } = props;

	const shouldUseModalCreatorField = false;
	const [active, setActive] = useState(null);
	const fieldComponents = useRef({});

	const icon = 'name' in creator ? '20/input-dual' : '20/input-single';
	const isDual = 'lastName' in creator;
	const creatorLabel = useMemo(() => {
		const creatorTypeDescription = creatorTypes.find(c => c.value == creator.creatorType) ||
			{ label: creator.creatorType };
		return creatorTypeDescription.label;
	}, [creator, creatorTypes]);

	useImperativeHandle(ref, () => ({
		focus: () => {
			const key = 'lastName' in creator ? 'lastName' : 'name';
			if(!isReadOnly && !isForm) {
				setActive(key);
			} else {
				key in fieldComponents.current && fieldComponents.current[key].focus();
			}
		}
	}));

	const handleFieldClick = useCallback(ev => {
		const { fieldName } = ev.currentTarget.dataset;
		if(!isReadOnly) {
			setActive(fieldName);
		}
	}, [isReadOnly]);

	const handleFieldFocus = handleFieldClick;

	const handleCancel = useCallback(() => {
		setActive(null)
	}, []);

	const handleEditableCommit = useCallback((newValue, hasChanged, srcEvent) => {
		const { fieldName } = srcEvent.currentTarget.dataset;
		if(hasChanged) {
			onChange(index, fieldName, newValue);
		}
		if(isForm && srcEvent) {
			if(srcEvent.type == 'keydown' && srcEvent.key == 'Enter') {
				srcEvent.target.blur();
			}
		}
		setActive(null);
	}, [index, isForm, onChange]);

	const handleCreatorTypeSwitch = useCallback(() => {
		onCreatorTypeSwitch(index);
	}, [index, onCreatorTypeSwitch]);

	const handleCreatorRemove = useCallback(ev => {
		onCreatorRemove(index);
		ev && ev.stopPropagation();
	}, [index, onCreatorRemove]);

	const handleCreatorAdd = useCallback(() => {
		onCreatorAdd(creator);
	}, [creator, onCreatorAdd]);


	const fieldClassName = cx({
		'creators-entry': true,
		'creators-oneslot': 'name' in creator,
		'creators-twoslot': 'lastName' in creator,
		'creators-modal-trigger': shouldUseModalCreatorField,
		'metadata': true,
		'single': isSingle,
		'virtual': isVirtual
	}, className);

	// raw formatted data for use in drag-n-drop indicator on touch. See CreatorDragPreview in drag-layer.jsx
	const raw = { ...creator, creatorType: creatorLabel };
	const inputProps = { active, creator, index, isForm, isReadOnly, label: creatorLabel, name, onCancel:
	handleCancel, onEditableCommit: handleEditableCommit, onFieldClick: handleFieldClick,
	onFieldFocus: handleFieldFocus, onAddMany };

	return (
		<React.Fragment>
		<Field
			className={ fieldClassName }
			index={ index }
			isSortable={ !isSingle && !isVirtual && !isReadOnly }
			key={ creator.id }
			onReorder={ onReorder }
			onReorderCancel={ onReorderCancel }
			onReorderCommit={ onReorderCommit }
			onDragStatusChange={ onDragStatusChange }
			raw={ raw }
			tabIndex = { 0 }
		>
			{ shouldUseModalCreatorField ?
				<div className="truncate">{ creatorLabel }</div> :
				<CreatorTypeSelector
					data-field-name="creatorType"
					className="form-control form-control-sm"
					index={ index }
					inputComponent={ SelectInput }
					isActive={ active === 'creatorType' }
					isDisabled = { isReadOnly }
					onCancel={ handleCancel }
					onClick={ handleFieldClick }
					onCommit={ handleEditableCommit }
					onFocus={ handleFieldFocus }
					onReorder={ onReorder }
					options={ creatorTypes }
					ref={ component => fieldComponents.current['creatorType'] = component }
					value={ creator.creatorType }
					creatorsCount = { creatorsCount }
				/>
			}
			<React.Fragment>
				{
					shouldUseModalCreatorField ? (
						<div className="truncate">
							{ isVirtual ? isDual ? 'last name, first name' : 'name' :
								(creator.name || (creator.firstName + ' ' + creator.lastName).trim())
							}
						</div>
					) : (
						isDual ? (
							<React.Fragment>
								<CreatorFieldInputWrap
									{ ...inputProps }
									name="lastName"
									label="last name"
									ref={ component => fieldComponents.current['lastName'] = component }
								/>
								<CreatorFieldInputWrap
									{ ...inputProps }
									name="firstName"
									label="first name"
									ref={ component => fieldComponents.current['firstName'] = component }
								/>
							</React.Fragment> ) :
							<CreatorFieldInputWrap
								{ ...inputProps }
								name="name"
								label="name"
								ref={ component => fieldComponents.current['name'] = component }
							/>
					)
				}
				{
					!isReadOnly && (
						<React.Fragment>
							<Button
								icon
								className="btn-single-dual"
								onClick={ handleCreatorTypeSwitch }
							>
								<Icon type={ icon } width="20" height="20" />
							</Button>
							{
								isDeleteAllowed ? (
									<Button
										icon
										className="btn-minus"
										onClick={ handleCreatorRemove }
									>
										<Icon type={ '16/minus' } width="16" height="16" />
									</Button>
								) : (
									<Button icon className="btn-minus" disabled={ true }>
										<Icon type={ '16/minus' } width="16" height="16" />
									</Button>
								)
							}
							{
								isCreateAllowed ? (
									<Button
										icon
										className="btn-plus"
										onClick={ handleCreatorAdd }
									>
										<Icon type={ '16/plus' } width="16" height="16" />
									</Button>
								) : (
									<Button icon className="btn-plus" disabled={ true }>
										<Icon type={ '16/plus' } width="16" height="16" />
									</Button>
								)
							}
					</React.Fragment>
				)}
		</React.Fragment>
		</Field>
		</React.Fragment>
	);
});

CreatorField.displayName = 'CreatorField';
CreatorField.propTypes = {
	className: PropTypes.string,
	creator: PropTypes.object,
	creatorsCount: PropTypes.number,
	creatorTypes: PropTypes.array,
	index: PropTypes.number,
	isCreateAllowed: PropTypes.bool,
	isDeleteAllowed: PropTypes.bool,
	isForm: PropTypes.bool,
	isReadOnly: PropTypes.bool,
	isSingle: PropTypes.bool,
	isVirtual: PropTypes.bool,
	onChange: PropTypes.func,
	onCreatorAdd: PropTypes.func,
	onCreatorRemove: PropTypes.func,
	onCreatorTypeSwitch: PropTypes.func,
	onDragStatusChange: PropTypes.func,
	onReorder: PropTypes.func,
	onReorderCancel: PropTypes.func,
	onReorderCommit: PropTypes.func,
	shouldPreOpenModal: PropTypes.bool,
};

export default memo(CreatorField);
