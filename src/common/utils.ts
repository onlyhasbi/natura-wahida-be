export const selectedColumn = (columnName: Array<string>) =>
  columnName.reduce((acc, column) => {
    acc[column] = true;
    return acc;
  }, {} as Record<string, boolean>);

export const getCurrentTime = () => Math.floor((new Date()).getTime() / 1000);

export const expiryDuration = (time: string) => getCurrentTime() + Number(time);