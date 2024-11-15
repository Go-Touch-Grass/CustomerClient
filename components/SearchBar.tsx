import React, { useState, useEffect } from 'react';
import { TextInput, FlatList, TouchableOpacity, Text, View, Keyboard } from 'react-native';
import { SubscriptionInfo, BranchInfo } from '../api/businessApi'; 

interface SearchBarProps {
  subscriptions: SubscriptionInfo[]; 
  onBranchSelect: (branch: BranchInfo) => void; 
}

const SearchBar: React.FC<SearchBarProps> = ({ subscriptions, onBranchSelect }) => {
  const [searchText, setSearchText] = useState('');
  const [filteredSubscriptions, setFilteredSubscriptions] = useState<SubscriptionInfo[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (isFocused) {
      const lowercasedSearchText = searchText.toLowerCase();
      const filtered = subscriptions.filter((subscription) => {
        const { branch } = subscription;
        if (!branch) return false;

        const { outletName, entityName, description, category } = branch;
        const matchesName = (outletName && outletName.toLowerCase().includes(lowercasedSearchText)) ||
                            (entityName && entityName.toLowerCase().includes(lowercasedSearchText));
        const matchesDescriptionOrCategory =
          (branch.entityType === 'Outlet' && description && description.toLowerCase().includes(lowercasedSearchText)) ||
          (branch.entityType === 'Business_register_business' && category && category.toLowerCase().includes(lowercasedSearchText));

        return matchesName || matchesDescriptionOrCategory;
      });

      setFilteredSubscriptions(filtered);
    } else {
      // When focused but no search text, show all subscriptions
      setFilteredSubscriptions(subscriptions);
    }
  }, [searchText, subscriptions, isFocused]);

  const handleFocus = () => {
    setIsFocused(true);
    setFilteredSubscriptions(subscriptions); // Show all branches when focused
  };

  /* const handleBlur = () => {
    if (searchText === '') {
      setFilteredSubscriptions([]); // Hide the list when blurred and input is empty
    }
  }; */

  return (
    <View style={{ padding: 10, marginTop: 60, marginLeft: 95 }}> {/* Adjust margins as needed */}
      <TextInput
        placeholder="Search for Business Avatars here..."
        value={searchText}
        onChangeText={setSearchText}
        onFocus={handleFocus}
        //onBlur={handleBlur}
        style={{
          height: 40,
          borderColor: '#000000',
          borderWidth: 1,
          paddingLeft: 10,
          borderRadius: 5,
          backgroundColor: 'white',
          opacity: 0.9,
          width: '100%', // Ensure the TextInput takes full width of the parent
          maxWidth: 300, // Add a max width to prevent resizing
        }}
      />
      {isFocused && (
        <FlatList
          data={filteredSubscriptions}
          keyExtractor={(item) => item.subscriptionId.toString()}
          renderItem={({ item }) => {
            const { branch } = item;
            const displayName = branch.entityType === 'Outlet' ? branch.outletName : branch.entityName;
            const descriptionOrCategory = branch.entityType === 'Outlet' ? branch.description : branch.category;
  
            return (
              <TouchableOpacity onPress={() => {
                onBranchSelect(branch);
                Keyboard.dismiss();
                setIsFocused(false); // Keep the list visible only when focused
              }}>
                <View style={{ 
                  padding: 10, 
                  borderBottomWidth: 1, 
                  borderColor: '#ccc',
                  backgroundColor: 'rgba(240, 248, 255, 0.9)', 
                  borderRadius: 5,
                  }}>
                  <Text>{displayName || "No Business Avatars available"}</Text>
                  {descriptionOrCategory && <Text>{descriptionOrCategory}</Text>}
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
};

export default SearchBar;
