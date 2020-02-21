import React, { useCallback, useMemo, useReducer } from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';
import { Row, themeSpacing } from '@datapunt/asc-ui';

import * as types from 'shared/types';

import {
  ControlsWrapper,
  Fieldset,
  Form,
} from 'signals/incident-management/components/FilterForm/styled';
import Label from 'components/Label';
import FormFooter from 'components/FormFooter';

import CategoryGroups from '../CategoryGroups';
import reducer from './reducer';
import { setCanView, setIsResponsible } from './actions';
import { incoming, outgoing } from './mapCategories';

const StyledFieldset = styled(Fieldset)`
  padding-top: ${themeSpacing(2)};
  padding-bottom: ${themeSpacing(10)};
  & > .Label {
    margin-bottom: ${themeSpacing(4)};
  }
`;

const CategoryLists = ({
  categories,
  department,
  findByMain,
  onSubmit,
  subCategories,
}) => {
  const categoriesMapped = useMemo(
    () => incoming(department.categories, subCategories),
    [department.categories, subCategories]
  );
  const [state, dispatch] = useReducer(reducer, categoriesMapped);

  const onSubmitForm = useCallback(
    event => {
      event.preventDefault();
      const formData = outgoing(state);

      onSubmit(formData);
    },
    [onSubmit, state]
  );

  const onChangeCanViewCategories = useCallback(
    (slug, selectedSubCategories) => {
      dispatch(setCanView({ slug, subCategories: selectedSubCategories }));
    },
    [dispatch]
  );

  const onChangeIsResponsibleCategories = useCallback(
    (slug, selectedSubCategories) => {
      dispatch(
        setIsResponsible({ slug, subCategories: selectedSubCategories })
      );
    },
    [dispatch]
  );

  const onCanViewMainCategoryToggle = useCallback(
    (slug, isToggled) => {
      const selectedSubCategories = isToggled ? categories[slug].sub : [];
      dispatch(setCanView({ slug, subCategories: selectedSubCategories }));
    },
    [categories, dispatch]
  );

  const onIsResponsibleMainCategoryToggle = useCallback(
    (slug, isToggled) => {
      const selectedSubCategories = isToggled ? categories[slug].sub : [];
      dispatch(
        setIsResponsible({ slug, subCategories: selectedSubCategories })
      );
    },
    [categories, dispatch]
  );

  return (
    <Row>
      <Form>
        <ControlsWrapper>
          <StyledFieldset>
            <Label as="span" isGroupHeader>
              Verantwoordelijk voor categorie
            </Label>

            {categories && (
              <CategoryGroups
                categories={categories}
                onChange={onChangeIsResponsibleCategories}
                onToggle={onIsResponsibleMainCategoryToggle}
                boxWrapperKeyPrefix="is_responsible"
                state={state.is_responsible}
                findByMain={findByMain}
              />
            )}
          </StyledFieldset>
        </ControlsWrapper>

        <ControlsWrapper>
          <StyledFieldset>
            <Label as="span" isGroupHeader>
              Toegang tot categorie
            </Label>

            {categories && (
              <CategoryGroups
                categories={categories}
                onChange={onChangeCanViewCategories}
                onToggle={onCanViewMainCategoryToggle}
                boxWrapperKeyPrefix="can_view"
                state={state.can_view}
                findByMain={findByMain}
              />
            )}
          </StyledFieldset>
        </ControlsWrapper>

        <FormFooter
          cancelBtnLabel="Annuleren"
          // onCancel={onCancel}
          onSubmitForm={onSubmitForm}
          submitBtnLabel="Opslaan"
        />
      </Form>
    </Row>
  );
};

CategoryLists.propTypes = {
  categories: types.categoriesType.isRequired,
  department: PropTypes.shape({
    categories: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  }).isRequired,
  findByMain: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  subCategories: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default CategoryLists;
