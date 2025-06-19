
import React, { createContext, useContext } from 'react';

interface EncryptionContextType {
  encrypt: (text: string, masterKey: string) => Promise<string>;
  decrypt: (encryptedText: string, masterKey: string) => Promise<string>;
  generateMasterKey: () => string;
  deriveKey: (password: string, salt: string) => Promise<string>;
}

const EncryptionContext = createContext<EncryptionContextType | undefined>(undefined);

export const useEncryption = () => {
  const context = useContext(EncryptionContext);
  if (context === undefined) {
    throw new Error('useEncryption must be used within an EncryptionProvider');
  }
  return context;
};

export const EncryptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  
  const generateMasterKey = (): string => {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  };

  const deriveKey = async (password: string, salt: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const saltData = encoder.encode(salt);
    
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      data,
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );

    const key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: saltData,
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );

    const exported = await crypto.subtle.exportKey('raw', key);
    return Array.from(new Uint8Array(exported), byte => byte.toString(16).padStart(2, '0')).join('');
  };

  const encrypt = async (text: string, masterKey: string): Promise<string> => {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(text);
      
      const keyData = new Uint8Array(masterKey.match(/.{2}/g)!.map(byte => parseInt(byte, 16)));
      const key = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'AES-GCM' },
        false,
        ['encrypt']
      );

      const iv = crypto.getRandomValues(new Uint8Array(12));
      const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        data
      );

      const combined = new Uint8Array(iv.length + encrypted.byteLength);
      combined.set(iv);
      combined.set(new Uint8Array(encrypted), iv.length);

      return btoa(String.fromCharCode(...combined));
    } catch (error) {
      console.error('Encryption failed:', error);
      throw new Error('Failed to encrypt data');
    }
  };

  const decrypt = async (encryptedText: string, masterKey: string): Promise<string> => {
    try {
      const combined = new Uint8Array(atob(encryptedText).split('').map(char => char.charCodeAt(0)));
      const iv = combined.slice(0, 12);
      const data = combined.slice(12);

      const keyData = new Uint8Array(masterKey.match(/.{2}/g)!.map(byte => parseInt(byte, 16)));
      const key = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'AES-GCM' },
        false,
        ['decrypt']
      );

      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        data
      );

      return new TextDecoder().decode(decrypted);
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error('Failed to decrypt data');
    }
  };

  const value = {
    encrypt,
    decrypt,
    generateMasterKey,
    deriveKey,
  };

  return <EncryptionContext.Provider value={value}>{children}</EncryptionContext.Provider>;
};
