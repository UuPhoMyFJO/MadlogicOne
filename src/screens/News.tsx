import React, {useCallback, useState, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {
  SafeAreaView,
  FlatList,
  RefreshControl,
  View,
  StyleSheet,
} from 'react-native';
import {
  Broadcast,
  eventEmitter,
  MADLOGIC_SDK_EVENTS,
  getBroadcasts,
  searchBroadcasts,
} from 'react-native-madlogic';
import {useTheme, Searchbar} from 'react-native-paper';
import {useIntl} from 'react-intl';

import TabHeader from '../components/TabHeader';
import {useGlobalStyles} from '../core/hooks/useGlobalStyle';
import NewsItemFactory from '../components/NewsItem/NewsItemFactory';
import {useStores} from '../core/hooks/useStores';
import NavigatorMap from '../navigations/NavigatorMap';

const styles = StyleSheet.create({
  footer: {
    marginBottom: 100,
  },
});

function News() {
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const theme = useTheme();
  const [globalStyles] = useGlobalStyles(theme);
  const store = useStores();
  const {formatMessage} = useIntl();

  const loadData = useCallback(async () => {
    try {
      setRefreshing(true);
      const list = await getBroadcasts();
      setBroadcasts(list);
      setRefreshing(false);
    } catch (error) {
      console.error(error);
    }
  }, [setBroadcasts]);

  useEffect(() => {
    const triggersChanged = eventEmitter.addListener(
      MADLOGIC_SDK_EVENTS.EVENT_TRIGGERS_CHANGED,
      loadData,
    );

    const searchChanged = eventEmitter.addListener(
      MADLOGIC_SDK_EVENTS.EVENT_SEARCH_BROADCAST_OK,
      setBroadcasts,
    );

    const broadcastWatched = eventEmitter.addListener(
      MADLOGIC_SDK_EVENTS.EVENT_BROADCAST_WATCHED,
      loadData,
    );

    const segmentChanged = eventEmitter.addListener(
      MADLOGIC_SDK_EVENTS.EVENT_SEGMENT_CHANGED,
      loadData,
    );
    loadData();
    return () => {
      triggersChanged.remove();
      searchChanged.remove();
      broadcastWatched.remove();
      segmentChanged.remove();
    };
  }, [loadData]);

  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = async (value: string) => {
    setSearchQuery(value);
    if (value) {
      const page: number = 0;
      const pageSize: number = 10;
      searchBroadcasts(value, page, pageSize);
    } else {
      loadData();
    }
  };

  return (
    <View style={globalStyles.container}>
      <SafeAreaView>
        <TabHeader />
        <Searchbar
          placeholder={formatMessage({id: 'news.search'})}
          onChangeText={handleSearch}
          value={searchQuery}
        />
        <FlatList
          refreshControl={
            <RefreshControl onRefresh={loadData} refreshing={refreshing} />
          }
          data={broadcasts}
          renderItem={({item}) => (
            <NewsItemFactory
              style={store?.ternantStore.tabs[NavigatorMap.Broadcasts].style}
              {...item}
            />
          )}
          keyExtractor={({id}: Broadcast) => id}
          ListFooterComponent={() => <View style={styles.footer} />}
        />
      </SafeAreaView>
    </View>
  );
}

export default observer(News);
