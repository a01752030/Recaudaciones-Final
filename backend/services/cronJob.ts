import cron from 'node-cron';

export function executeCronJob(): void {
  cron.schedule('* * * * *', () => {
    console.log('Cron job executed');
    // Your code to be executed goes here
  });
}
