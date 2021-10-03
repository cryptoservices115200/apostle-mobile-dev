import React, { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import { Keyboard, Dimensions } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { useNavigation, useRoute, useNavigationState } from '@react-navigation/native';
import { get, isNil } from 'lodash';

import { ParamKeys, Screens } from '@/Constants';
import { useOvermind } from '@/store';

export function useOrder() {
  const route = useRoute();
  return get(route, `params.${ParamKeys.order}`);
}

/**
 * [React hook that is most commonly used for search in UI e.g. List Search]
 * Can also be used for local search. for remote search, just do not reference the filtered data.
 * @param  {[Object]}   data        [Original Data to Search]   : Required
 * @param  {[Function]} fnFilter    [Filter function: 1st Parameter : Data, 2nd Parameter : filter] : Required
 * @param  {[Object]}   initialFilter [Initial Filter Object] Can be empty
 * @param  {[Number]}   timeout     [Search Timeout : Default 300]
 * @return {[Array]}                [1st element is filteredData, 2nd element is filterChangeCallback]
 */
export function useSearch(data, fnFilter, initialFilter, timeout) {
  const [filter, setFilter] = useState(initialFilter);
  const timeoutRef = useRef();

  const filteredData = useMemo(() => fnFilter(data, filter), [data, filter]);

  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);

  function onFilterChange(newFilter) {
    // ClearOut timer for previous handler.
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setFilter(newFilter);
    }, timeout || 300);
  }

  return [filteredData, onFilterChange];
}

/**
 * Use ImagePicker Hook
 * @param  {[type]} source  [description]
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
export function useImagePicker(initialSource, handler, pickerOptions) {
  const [base64, setBase64] = useState();
  const [source, setSource] = useState(initialSource);
  const [contentType, setContentType] = useState();

  const { showActionSheetWithOptions } = useActionSheet();

  pickerOptions = pickerOptions || {};

  function pickAvatar() {
    const options = ['Take New Photo', 'Photo Library', 'Cancel'];
    const cancelButtonIndex = 2;
    showActionSheetWithOptions(
      { options, cancelButtonIndex },
      async buttonIndex => {
        const options = {
          width: 512,
          height: 512,
          cropping: true,
          mediaType: 'photo',
          includeBase64: true,
          useFrontCamera: true,
          ...pickerOptions
        };

        try {
          let picked = null;
          if (buttonIndex === 1) {
            picked = await ImagePicker.openPicker(options);
          } else if (buttonIndex === 0) {
            picked = await ImagePicker.openCamera(options);
          } else if (buttonIndex === cancelButtonIndex) {
          handler?.({isCancelled: true})
          return
          }
          if (picked) {
            const { path, data, mime } = picked;
            setBase64(data);
            setSource({ uri: path });
            setContentType(mime);

            const result = {
              source: {uri:path},
              base64: data,
              contentType: mime,
              from: (buttonIndex === 0) ? 'camera' : 'gallery'
            }

            // Also call handler here.
            handler?.({result})
            return
          }
          throw new Error("useImagePicker(): Unknown error")
        } catch (error) {
          console.log('useImagePicker(): Error Occured');
          handler?.({ error })
        }
      }
    );
  }

  return { source, contentType, base64, pick: pickAvatar };
}

/**
 * Use Loading Indicator
 * @param  {Boolean} isLoading [description]
 * @return {[type]}            [description]
 */
export function useLoadingHud(isLoading){
  const { actions } = useOvermind();
  useEffect( () => {
    if (isLoading) {
      actions.hud.show();
    } else {
      actions.hud.hide();
    }
  }, [isLoading]);
}

/**
 * UseDelay
 * when argument changes, schedule call
 */
export function useDelay(call, timeout) {
  const timeoutRef = useRef();
  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);

  return useCallback( (...params) => {
    // ClearOut timer for previous handler.
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      call(...params)
    }, timeout || 300);
  }, [call, timeout])
}

/**
 * More configurable, set timeout on each call.
 * Becareful to use, first parameter should be timeout
 * @param  {[type]} call [description]
 * @return {[type]}      [description]
 */
export function useDelayTimeout(call) {
  const timeoutRef = useRef();
  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);

  return useCallback( (timeout, ...params) => {
    // ClearOut timer for previous handler.
    clearTimeout(timeoutRef.current);
    if (timeout > 0) {
      timeoutRef.current = setTimeout(() => {
        call(...params)
      }, timeout || 300);
    } else {
      // Just call params
      call(...params)
    }
  }, [call])
}

/**
 * It's hard to pass => pass => pass params between the screens
 * so in stack, traverse reverse and  find out if the parameter is set.
 * useful.
 * @param  {[type]} keyname [description]
 * @return {[type]}         [description]
 */
export function useRouteParamInStack(keyname){
  return useNavigationState(state => {
    const routes = state.routes || []
    // Traverse the routes and find out the parameter
    for (let i = routes.length - 1; i >=0 ; i--){
      const value = get(routes[i], `params.${keyname}`)
      if (!isNil(value)){
        return value
      }
    }
    return undefined
  })
}

/**
 * Traverse and Get the key with specific screen name
 * @param  {[type]} screenName [description]
 * @return {[type]}            [description]
 */
export function useGetNavKeyWithScreenName(screenName) {
  return useNavigationState(state => {
    const routes = state.routes || []
    // Traverse the routes and find out the parameter
    for (let i = routes.length - 1; i >=0 ; i--){
      if (routes[i].name === screenName){
        return routes[i].key
      }
    }
    return undefined
  })
}

/**
 * Function to get the current navigation context.
 * @return {[type]} [description]
 */
export function useNavContext(){
  return useRouteParamInStack(ParamKeys.context) || {}
}

/*
*
*/
export const useForceUpdate = () => {
  const [v, setV] = useState()
  return () => setV(Math.random())
};

/*
*
*/
export const useSitePicker = () => {
  const navigation = useNavigation();
  const { state } = useOvermind();

  return (handler) => {
    const screenName = state.currentUser.isLunchtimeSet ? Screens.siteSelector : Screens.googlePlaceSelector
    navigation.navigate(screenName, {
      onSelect: handler
    })
  }
};
