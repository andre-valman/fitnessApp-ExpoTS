import moment from "moment";
import { MomentInput } from "moment";
import React, { createContext, useContext, useEffect, useState } from "react";
import { filterIsToday, getLocalStorage, setLocalStorage } from "../helpers";
import { Item, DataProviderData } from "../types";

const DataContext = createContext<DataProviderData>({} as DataProviderData);

export const DataProvider: React.FC = ({ children }) => {
  const [currentDate, setCurrentDate] = useState<MomentInput>(moment());
  const [currentKcal, setCurrentKcal] = useState<number>(0);
  const [currentList, setCurrentList] = useState<Item[]>([]);
  const [listAllItems, setListAllItems] = useState<Item[]>([]);

  useEffect(() => {
    getStorageData();
  }, []);

  useEffect(() => {
    updateCurrentDay();
  }, [currentDate, listAllItems]);

  const getStorageData = async () => {
    const response = await getLocalStorage();
    setListAllItems(response);
  };

  const addItem = async (item: Item) => {
    if (listAllItems) {
      const newList = [...listAllItems, item];
      setListAllItems(newList);
      await setLocalStorage(newList);
      updateCurrentDay();
    } else {
      setListAllItems([item]);
      await setLocalStorage([item]);
      updateCurrentDay();
    }
    setCurrentDate(moment());
  };

  const updateCurrentDay = () => {
    if (listAllItems) {
      const filteredList = listAllItems.filter((item) =>
        filterIsToday(item.date, currentDate)
      );

      const countKcal = filteredList.reduce((acc, currentValue) => {
        return acc + currentValue.kcal;
      }, 0);

      setCurrentList(filteredList);
      setCurrentKcal(countKcal);
    }
  };

  const handleChangeDate = async (date: MomentInput) => {
    setCurrentDate(date);
  };

  return (
    <DataContext.Provider
      value={{
        currentDate,
        currentKcal,
        currentList,
        addItem,
        handleChangeDate,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("use into of Data Context");

  return context;
};
