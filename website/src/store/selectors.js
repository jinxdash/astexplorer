import {createSelector} from 'reselect';
import isEqual from 'lodash.isequal';
import {getParserByID, getTransformerByID} from '../parsers';
import {matchesURL} from '../storage/parse';

// UI related

export function getCursor(state) {
  return state.cursor;
}

export function getError(state) {
  return state.error;
}

export function isLoadingSnippet(state) {
  return state.loadingSnippet;
}

export function showSettingsDialog(state) {
  return state.showSettingsDialog;
}

export function showShareDialog(state) {
  return state.showShareDialog;
}

export function isForking(state) {
  return state.forking;
}

export function isSaving(state) {
  return state.saving;
}

// Parser related

export function getParser(state) {
  return getParserByID(state.workbench.parser);
}

export function getParserSettings(state) {
  return state.workbench.parserSettings;
}

export function getParseError(state) {
  return state.workbench.parseError;
}

// Code related
export function getRevision(state) {
  return state.activeRevision;
}

export function getCode(state) {
  return state.workbench.code;
}

export function getInitialCode(state) {
  return state.workbench.initialCode;
}

const isCodeDirty = createSelector(
  [getCode, getInitialCode],
  (code, initialCode) => code !== initialCode
);

// Transform related

export function getTransformCode(state) {
  return state.workbench.transform.code;
}

export function getInitialTransformCode(state) {
  return state.workbench.transform.initialCode;
}

export function getTransformer(state) {
  return getTransformerByID(state.workbench.transform.transformer);
}

export function showTransformer(state) {
  return state.showTransformPanel;
}

const isTransformDirty = createSelector(
  [getTransformCode, getInitialTransformCode],
  (code, initialCode) => code !== initialCode
);

export const canFork = createSelector(
  [getRevision],
  (revision) => !!revision
);

const canSaveCode = createSelector(
  [isCodeDirty],
  dirty => dirty && !matchesURL() // cannot save Parse snippets
);

export const canSaveTransform = createSelector(
  [showTransformer, isTransformDirty],
  (showTransformer, dirty) => showTransformer && dirty
);

const didParserSettingsChange = createSelector(
  [getParserSettings, getRevision],
  (parserSettings, revision) => {
    const savedParserSettings = revision && revision.getParserSettings();
    return !!revision &&
      !!savedParserSettings &&
      !isEqual(parserSettings, savedParserSettings);
  }
);

export const canSave = createSelector(
  [canSaveCode, canSaveTransform, didParserSettingsChange],
  (canSaveCode, canSaveTransform, didParserSettingsChange) => (
    canSaveCode || canSaveTransform || didParserSettingsChange
  )
);