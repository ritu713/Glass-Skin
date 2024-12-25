import pandas as pd
import numpy as np
from os.path import exists

df_path = "product_dataset.csv" if exists("product_dataset.csv") else print("Error : No dataset found")
data = pd.read_csv(df_path)


# Data preprocessing 
data['concern 2'].fillna('', inplace = True)
data['concern 3'].fillna('', inplace = True)
data['concern'] = data['concern'] + ',' + data['concern 2'] + ',' + data['concern 3']

data.drop(columns=['concern 2', 'concern 3', 'formulation', 'key ingredient', 'spf'], inplace = True)

data = data[((data['label'] == 'face-moisturisers') | (data['label'] == 'mask-and-peel') | (data['label'] == 'cleanser') | (data['label'] == 'sunscreen') | (data['label'] == 'eye-cream'))]
LABELS = list(data['label'].unique())

data = data[data['skin type'].isna() == False]
data.index = [i for i in range (len(data))]

data['concern'] = data['concern'].str.lower()


# After analysing each conern, I hae chosen those which have the most products associated with them
top_concerns = {
    'eye-cream' : 'fine lines,wrinkles,dark circles,eye bags',
    'sunscreen' : 'sun protection',
    'mask-and-peel' : 'daily use',
    'cleanser' : 'general care',
    'face-moisturisers' : 'general care'
}

for i, entry in data.iterrows():
    label = entry['label']
    if pd.isnull(entry['concern']):
        data.loc[i, 'concern'] = top_concerns[label]


# Now let's get rid of products working on concerns that are not common, to attain better/accurate results from our model.

def extract_concerns(concern_string):
    elements = concern_string.split(',')
    for word in elements:
        if(word != ''):
            if word in concerns:
                concerns[word] += 1
            else:
                concerns[word] = 1

concerns = {}
for i in range(len(data)):
    extract_concerns(data.iloc[i]['concern'])


concerns = sorted(concerns.items(), key = lambda kvp : (kvp[1], kvp[0]))
#the above basically sorts the items in 'concerns' object according to the 1st column, against the default 0th column

for _ in range(14):
    concerns.pop(0)


feature_list = list(data['skin type'].unique()) + [item[0] for item in concerns]

# Now, we have our data processed, we will move onto one hot encoding of our data due to precense of various skin types and skin concerns

ohe = np.zeros([len(data), len(feature_list)])

def isPresent(target_concern, item):
    if target_concern in data.iloc[item]['concern']:
        return True
    return False

#skin types
for i in range(len(data)):
    for j in range(5):
        skin_type_product = data.iloc[i]['skin type']
        if(skin_type_product == 'All'):
            ohe[i][0:5] = 1
            break;
        elif(feature_list[j] == skin_type_product):
            ohe[i][j] = 1;

#concern as feature
for i in range(len(data)):
    for j in range(5, len(feature_list)):
        if feature_list[j] in data.iloc[i]['concern']:
            ohe[i][j] = 1

