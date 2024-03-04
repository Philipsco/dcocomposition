const CMD_A = "A";
const CMD_B = "B";
const CMD_C = "C";
const CMD_D = "D";
const SHIFT1 = 1;
const SHIFT2 = 2;
const SHIFT3 = 3;
const invalidCommand = "Mohon maaf command tidak tersedia! 🙏"

const shiftTime = `
Masuk Shift apa ya ka kalau boleh tau??

\/shift_1 : Masuk Shift 1
\/shift_2 : Masuk Shift 2
\/shift_3 : Masuk Shift 3
`;
const groupBCA = [
  [
    {
      text: "A",
      callback_data: CMD_A
    },
    {
      text: "B",
      callback_data: CMD_B
    }
  ],[
    {
      text: "C",
      callback_data: CMD_C
    },
    {
      text: "D",
      callback_data: CMD_D
    }
  ]];

const panduanText = `
Silahkan gunakan perintah yang tersedia berikut ini :
xxxxxx

Terimakasih
`
const greetText= `
Welcome to the SysoBot!
How can I assist you?
Possible use cases:
\/generate: membantu kamu untuk membuat komposisi grup yang bertugas hari ini
\/help: membantu mengetahui command apa saja yang ada di Bot ini
\/quote: membantu kamu makin semangat buat bekerja hari ini
\/generatePantun: membantu kamu untuk membuat pantun hari ini

Thankyou
`
const hadirText = `
Apakah member grup Masuk semua??
\/masuk_semua: untuk memberi tahu bahwa semua hadir
\/ada_yang_tidak_hadir: untuk memberi tahu bahwa ada yang tidak hadir

Terimakasih
`
const fullTeamA = `
______________________
#WSA2
Hadir : RAN (SL), SysO [RZP (TL), YRA, ARR], SOC [NDA], FM [Dede], DCMon [BAL (TL), ASN,ABA]
______________________
#MBCA
Hadir : NHU (SL), Syso [AMN (TL), SON, WYG], SOC [WAR], DCMon [DCW (TL), FKH, PBK]
______________________
#GAS
Hadir : ASY (SL), SysO [EKA (TL), FIK, CHF], DCMon [RNA (TL), GNG, ALJ]
______________________
#GAC
Hadir : APA (SL), FOC [ADN, MRW]
______________________
`
const fullTeamC = `
#WSA                                                                                                
Hadir : RID (SL), BDW (TL), HRZ & ALM (Syso), KRM (TL DCMon), MSH & FPH (DCMon), Bagus(FM)
Tidak Hadir :  -

#MBCA
Hadir : VNT (SL), EMO (TL Syso), TCH & SCH (Syso), RBI (TL DCmon), MAB (DCMon), MUI (SOC)
Tidak Hadir : -

#GAS
Hadir :  IPA (SL), JVR (TL syso), KRI & DVP (Syso), AWL (TL DCMon), MIW & LCW (DCMon), LAL (SOC)
Tidak Hadir :  - 

#GAC
Hadir : JFR (SOC), Baharuddin & MAO (PMX/FOC)
Tidak Hadir : -

----------------------------------------------------------------------------------
Terima kasih,
Grup C
`
const fullTeamB = `
#MBCA    
WFO : GAA (SL), LHN (TL SYSO), NBK (SYSO), MRB (SOC), GOS (SYSO), CAD (TL DCMON), DPN+ICS (DCMON) 
Tidak Hadir: -
 
#WSA    
WFO :  DFM (SL), WYN (TL-SYSO), ARV (SYSO), ZOE (TL DCMON), RZM+DAL (DCMON), TYO (SOC), Agus (FM) 
Tidak Hadir : - 
 
#GRHA    
WFO : ARM (SL), NUG (TL-SYSO), AXL+MWS (SYSO), YRS (TL DCMON), NFL+ESI (DCMON), YMH (SOC)     
Tidak Hadir :  - 
 
#GAC    
WFO : TSR+SUT (SOC), DWN (FOC) + Firman (PMX / FOC) 
Tidak Hadir : -     
 
Terima kasih
`
const fullTeamD = `
*WSA2                                                                                                       
Hadir: HAN (SL), RIF (TL-SysO), DND & BMP (SysO), IVM (TL-DCMon), RKS & FKR (DCMon), AGE (SOC) 
Tidak Hadir: -
                                                                                                  
*MBCA                                                                                                       
Hadir: AGF (SL), MRF (TL-SysO), SNH (Syso), DKY (Syso), KDV (TL-DCMon), RHH (DCMon), BOR (DCMon) , FTY (SOC) 
Tidak Hadir: -
                                                                                                  
*GAS                                                                                                    
Hadir: SAW (SL), HKT (TL-SysO), RRD & IPO (SysO), AFH (TL-DCMon), KIN & DBS (DCMon), BAY (SOC) 
Tidak Hadir: -  
  
*GAC   
Hadir: ABR (SL/SOC), DRH (FOC),Dimas (PMX) 
Tidak Hadir: - 
---------------------------------------------------------------------------------------------------`

module.exports = {groupBCA, shiftTime, invalidCommand, panduanText, greetText, hadirText, fullTeamA, fullTeamB, fullTeamC, fullTeamD}